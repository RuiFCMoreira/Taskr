package pt.mei.ea.taskr.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pt.mei.ea.taskr.controllers.OrderController;

import pt.mei.ea.taskr.dto.ReviewDTO;
import pt.mei.ea.taskr.models.*;
import pt.mei.ea.taskr.repositories.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final ClientRepository clientRepository;
    private final ProviderRepository providerRepository;
    private final ServiceTypeRepository serviceTypeRepository;
    private final ProviderServiceRepository providerServiceRepository;

    private final AvailabilityIntervalRepository availabilityIntervalRepository;

    private final NotificationService notificationService;

    public OrderService(ProviderServiceRepository providerServiceRepository, OrderRepository orderRepository, ClientRepository clientRepository, ProviderRepository providerRepository, ServiceTypeRepository serviceTypeRepository, AvailabilityIntervalRepository availabilityIntervalRepository, NotificationService notificationService) {
        this.providerServiceRepository = providerServiceRepository;
        this.orderRepository = orderRepository;
        this.clientRepository = clientRepository;
        this.providerRepository = providerRepository;
        this.serviceTypeRepository = serviceTypeRepository;
        this.availabilityIntervalRepository = availabilityIntervalRepository;
        this.notificationService = notificationService;
    }



    public Order getOrder(Long id){
        return orderRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Order not found"));
    }

    public boolean providerIsAvailable(Provider provider, LocalDateTime dateTime, Duration duration){
//      check if provider is available at that time of day and day of week
        List<AvailabilityInterval> availabilityIntervals = availabilityIntervalRepository.findByProvider(provider);
        return availabilityIntervals.stream().anyMatch(
                ai -> (ai.getDay().equals(dateTime.getDayOfWeek()) &&
                        !ai.getStartTime().isAfter(dateTime.toLocalTime()) && !ai.getEndTime().isBefore(dateTime.toLocalTime().plus(duration.toMinutes(), ChronoUnit.MINUTES))
                )
        );

////      check if provider has no order at that time
//        List<Order> futureOrders = provider.getOrders().stream().filter(order -> List.of(Order.OrderState.pending, Order.OrderState.accepted).contains(order.getState())).toList();
//
//        futureOrders.stream().anyMatch(order -> order.getDateHour())
//
//        DayOfWeek dayOfWeek = dateTime.getDayOfWeek();
//        int hour = dateTime.getHour();
//
//
//        return false;
    }

    /**
     * Add order to database
     * */
    public void addOrder(OrderController.NewOrderRequest request){
        Provider provider = providerRepository.findByIdAndIsDeletedIsFalse(request.providerId()).orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST,"Provider not found"));
        log.debug("Found provider " + provider);
        Client client = clientRepository.findByIdAndIsDeletedIsFalse(request.clientId()).orElseThrow(
                            () -> new ResponseStatusException(HttpStatus.BAD_REQUEST,"Client not found"));
        log.debug("Found client " + client);
        System.out.println("ID: " + request.serviceTypeId());
        ServiceType serviceType = serviceTypeRepository.findById(request.serviceTypeId()).orElseThrow(
                                    () -> new ResponseStatusException(HttpStatus.BAD_REQUEST,"Service type not found"));
        log.debug("Found serviceType " + serviceType);

        ProviderService ps = providerServiceRepository.findById(new ProviderServiceId(request.providerId(), request.serviceTypeId())).orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST,"Provider does not provide service type"));
        log.debug("Found providerService " + ps);

        Address address = new Address(request.street(), request.parish(), request.municipality(), request.district());

        boolean providesServiceInArea = provider.getServiceAreas().stream()
                                                                      .anyMatch(sa ->
                                                                            (sa.getDistrict().getName().equals(address.getDistrict()) &&
                                                                            (sa.getMunicipality().getName().equals(address.getMunicipality())
                                                                            || sa.getMunicipality().getName().equals("todos"))
                                                                      ));

        if(!providesServiceInArea){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Provider does not provider service in area");
        }

        if(!providerIsAvailable(provider,request.dateHour(), ps.getExpectedDuration())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Provider not available at the date specified");
        }

        log.info(request.toString());
        Order order = new Order(provider, request.description(), request.dateHour(), serviceType,ps.getExpectedDuration(),ps.getPricePerHour(),address,client);


        address.setOrder(order);

        orderRepository.save(order);
        notificationService.addNotification(provider, Notification.NotificationType.NEW_ORDER, "A new order has been requested",order.getId().toString());
    }

    /**
     * Make a review about an order
     * */
    public void makeReview(Long orderId, OrderController.ReviewRequest request){
        Order order = getOrder(orderId);
        if(!order.getState().equals(Order.OrderState.paid)){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order is not completed");
        } else if(order.getReview() != null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order is already reviewed");
        }
        Provider provider = order.getProvider();
        provider.addRating(request.rating());

        ProviderService ps = providerServiceRepository.findById(new ProviderServiceId(provider.getId(), order.getServiceType().getId())).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not find Provider Service"));

        ps.addRating(request.rating());
        Review review = new Review(order, request.description(), request.rating());
        order.setReview(review);
        orderRepository.save(order);
        notificationService.addNotification(order.getProvider(), Notification.NotificationType.ORDER_REVIEWED, "An order you have completed has been reviewed",order.getId().toString());
    }

    public void setComplete(Long orderId,Duration duration){
        Order order = getOrder(orderId);
        if(!order.getState().equals(Order.OrderState.accepted)){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order not accepted yet");
        }

        ProviderService ps = providerServiceRepository.findById(new ProviderServiceId(order.getProvider().getId(), order.getServiceType().getId())).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not find Provider Service"));

        ps.setNumberOfCompletedTasks(ps.getNumberOfCompletedTasks()+1);
        order.setDuration(duration);
        order.setState(Order.OrderState.completed);
        orderRepository.save(order);
        notificationService.addNotification(order.getClient(), Notification.NotificationType.PAY, "A completed order needs to be paid!",order.getId().toString());
    }

    public void accept(Long orderId){
        Order order = getOrder(orderId);
        if(order.getState().equals(Order.OrderState.pending)) {
            order.setState(Order.OrderState.accepted);
            orderRepository.save(order);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order is not pending");
        }

        notificationService.addNotification(order.getClient(), Notification.NotificationType.ORDER_ACCEPTED, "An order you have requested has been accepted!", order.getId().toString());
    }

    public void reject(Long orderId){
        Order order = getOrder(orderId);
        if(order.getState().equals(Order.OrderState.pending)) {
            order.setState(Order.OrderState.rejected);
            orderRepository.save(order);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order is not pending");
        }

        notificationService.addNotification(order.getClient(), Notification.NotificationType.ORDER_REJECTED, "An order you have requested has been rejected!", order.getId().toString());
    }

    public void cancel(Long id) {
        Order order = getOrder(id);
        if(order.getState().equals(Order.OrderState.pending)){
            orderRepository.delete(order);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order cannot be canceled as it is not pending");
        }
    }

    public ReviewDTO getReview(Long id){
        Order order = getOrder(id);
        return ReviewDTO.getDTO(order.getReview());
    }

    public void pay(Long orderId) {
        Order order = getOrder(orderId);
        if(!order.getState().equals(Order.OrderState.completed)){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order not completed yet");
        }
        order.setState(Order.OrderState.paid);
        orderRepository.save(order);
        notificationService.deleteNotificationByReferTo(order.getId().toString());
        notificationService.addNotification(order.getProvider(), Notification.NotificationType.ORDER_PAID, "An order you have completed has been paid!", order.getId().toString());

    }
}
