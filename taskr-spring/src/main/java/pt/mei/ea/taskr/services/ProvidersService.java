package pt.mei.ea.taskr.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pt.mei.ea.taskr.config.JwtService;
import pt.mei.ea.taskr.controllers.ProviderController;
import pt.mei.ea.taskr.dto.*;
import pt.mei.ea.taskr.models.*;
import pt.mei.ea.taskr.repositories.*;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ProvidersService {

    private static final Logger log = LoggerFactory.getLogger(ProvidersService.class);

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;
    private final UserService userService;
    private final StorageService storageService;
    private final ProviderRepository providerRepository;
    private final ServiceTypeRepository serviceTypeRepository;
    private final ProviderServiceRepository providerServiceRepository;
    private final DistrictRepository districtRepository;

    private final MunicipalityRepository municipalityRepository;

    private final ServiceAreaRepository serviceAreaRepository;

    private final AvailabilityIntervalRepository availabilityIntervalRepository;

    private final NotificationService notificationService;


    public ProvidersService(PasswordEncoder passwordEncoder, JwtService jwtService, UserService userService, StorageService storageService, ProviderRepository providerRepository, ServiceTypeRepository serviceTypeRepository, ProviderServiceRepository providerServiceRepository, DistrictRepository districtRepository, MunicipalityRepository municipalityRepository, ServiceAreaRepository serviceAreaRepository, AvailabilityIntervalRepository availabilityIntervalRepository, NotificationService notificationService) {
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userService = userService;
        this.storageService = storageService;
        this.providerRepository = providerRepository;
        this.serviceTypeRepository = serviceTypeRepository;
        this.providerServiceRepository = providerServiceRepository;
        this.districtRepository = districtRepository;
        this.municipalityRepository = municipalityRepository;
        this.serviceAreaRepository = serviceAreaRepository;
        this.availabilityIntervalRepository = availabilityIntervalRepository;
        this.notificationService = notificationService;
    }

    private Provider findProviderById(Long providerId){
        return providerRepository.findByIdAndIsDeletedIsFalse(providerId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Provider not found"));
    }

    public List<ProviderDTO> getAllProviders(){
        return providerRepository.findAllByIsDeletedIsFalse().stream().map(provider -> ProviderDTO.getDTO(provider, new String(storageService.downloadFile(provider.getPhotoURL())))).toList();
    }

    public List<ProviderWithReviewDTO> getProvidersByParams(Integer rating, Long typeId, String district, String municipality, String state){
        ServiceType st;
        Stream<Provider> providerStream;

        if(rating == null && typeId == null){
            providerStream = providerRepository.findAllByIsDeletedIsFalse().stream();
        } else if(typeId != null){
            st = serviceTypeRepository.findById(typeId).orElseThrow(
                    () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Could not find service type by id")
            );
            List<ProviderService> providerServices = providerServiceRepository.findByType(st);
            providerStream = providerServices.stream().map(ProviderService::getProvider);

        } else {
            providerStream = providerRepository.findByAverageRatingGreaterThanEqualAndIsDeletedIsFalse(Float.valueOf(rating)).stream();
        }

        if(district != null && municipality != null){
            providerStream = providerStream.filter(provider -> provider.getServiceAreas().stream()
                    .anyMatch(sa -> (sa.getDistrict().getName().equals(district) &&
                            (sa.getMunicipality().getName().equals(municipality) || sa.getMunicipality().getName().equals("todos")))));
        } else if (district != null){
            providerStream = providerStream.filter(provider -> provider.getServiceAreas().stream()
                    .anyMatch(sa -> (sa.getDistrict().getName().equals(district))));
        } else if(municipality != null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can´t filter by municipality without district");
        }

        if(state != null){
            providerStream = switch (state) {
                case "accepted" -> providerStream.filter(p -> p.getState().equals(Provider.ProviderState.accepted));
                case "rejected" -> providerStream.filter(p -> p.getState().equals(Provider.ProviderState.rejected));
                case "pending" -> providerStream.filter(p -> p.getState().equals(Provider.ProviderState.pending));
                default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"The state provided in not valid");
            };
        }

        return providerStream.map(provider -> ProviderWithReviewDTO.getDTO(
                provider,
                new String(storageService.downloadFile(provider.getPhotoURL())),
                provider.getOrders().stream().filter(order -> order.getServiceType().getId().equals(typeId) || typeId == null).sorted(Comparator.comparing(Order::getDateHour).reversed()).map(Order::getReview).filter(Objects::nonNull).map(ReviewDTO::getDTO).findFirst().orElse(null))).toList();
    }

    public List<Provider> getProviderByRating(Integer rating){
        return providerRepository.findByAverageRatingGreaterThanEqualAndIsDeletedIsFalse(Float.valueOf(rating));
    }

    public List<Provider> getProviderByServiceType(Long typeId) {
        ServiceType st = serviceTypeRepository.findById(typeId).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Could not find service type by id")
        );
        log.debug("Got servicetype " + st);
        List<ProviderService> providerServices = providerServiceRepository.findByType(st);
        return providerServices.stream().map(ProviderService::getProvider).toList();
    }

    public ProviderController.addProviderResponse addProvider(ProviderController.NewProviderRequest request) {
        log.info(request.toString());

        userService.checkUniqueUser(request.email(), request.phone());

        Provider provider = new Provider();
        provider.setName(request.name());
        provider.setEmail(request.email());
        provider.setPassword(passwordEncoder.encode(request.password()));
        provider.setPhone(request.phone());
        provider.setBirthDate(request.birthDate());
        provider.setNif(request.nif());
        Provider p = providerRepository.save(provider);

        String imageName = p.getId() + "-profile-photo";

        storageService.uploadFile(imageName, request.photo().getBytes());

        p.setPhotoURL(imageName);
        providerRepository.save(p);

        String token = jwtService.generateToken(p);
        return new ProviderController.addProviderResponse(p.getId(),"provider", token);
    }

    public ProviderDTO getProvider(Long id) {
        Provider p = providerRepository.findByIdAndIsDeletedIsFalse(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Provider not found"));
        String providerImage = new String(storageService.downloadFile(p.getPhotoURL()));
        return ProviderDTO.getDTO(p, providerImage);
    }

    public void approveProvider(Long id) throws ResponseStatusException {
        Provider p = findProviderById(id);
        p.setState(Provider.ProviderState.accepted);
        notificationService.addNotification(p, Notification.NotificationType.ORDER_ACCEPTED,"Your provider account was approved","");
        providerRepository.save(p);
    }

    public void addProviderService(Long providerId, ProviderController.NewProviderServiceRequest request) {
        Provider provider = findProviderById(providerId);
        ServiceType serviceType = serviceTypeRepository.findById(request.serviceTypeId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service type not found"));

        ProviderServiceId psId = new ProviderServiceId(providerId, request.serviceTypeId());
        ProviderService ps = providerServiceRepository.findById(psId).orElseGet(() -> new ProviderService(
                serviceType,
                provider));

        ps.setDescription(request.description());
        ps.setPricePerHour(request.pricePerHour());
        ps.setExpectedDuration(request.expectedDuration());

        providerServiceRepository.save(ps);
    }

    public void addProviderServiceArea(Long providerId, ProviderController.NewProviderAreaRequest request) {
        Provider provider = findProviderById(providerId);
        District district = districtRepository.findByName(request.district()).orElseGet(
                () -> districtRepository.save(new District(request.district()))
        );
        log.info(district.getId().toString());
        List<Municipality> municipalities = district.getMunicipalities();

        Municipality municipality = municipalities.stream().filter(m -> m.getName().equals(request.municipality())).findAny().orElseGet(
                () -> municipalityRepository.save(new Municipality(district, request.municipality()))
        );
        log.info(municipality.getId().toString());

        ServiceArea sa = new ServiceArea(provider, district, municipality);

        serviceAreaRepository.save(sa);
    }

    public void setProviderAvailability(Long providerId, ProviderController.NewProviderAvailabilityRequest request) {
        Provider provider = findProviderById(providerId);
        availabilityIntervalRepository.deleteAll(provider.getCalendarAvailability());
        request.availabilities().forEach(avdto -> availabilityIntervalRepository.save(new AvailabilityInterval(provider, avdto.day(), avdto.startTime(), avdto.endTime())));
    }

    public List<OrderDTO> getProviderOrders(Long id, String orderState){
        Provider p =  findProviderById(id);
        return p.getOrders().stream().filter(order -> orderState == null || order.getState().toString().equals(orderState)
                ).map(OrderDTO::getDTO).collect(Collectors.toList());
    }

    public List<ReviewDTO> getProviderReviews(Long providerId, Long typeId){
        Provider p = findProviderById(providerId);
        Stream<Order> orderStream = p.getOrders().stream();
        if(typeId != null){
            orderStream = orderStream.filter(order -> order.getServiceType().getId().equals(typeId));
        }
        return orderStream.map(Order::getReview).filter(Objects::nonNull).map(ReviewDTO::getDTO).toList();
    }

    public void editDetails(Long id, ProviderController.NewEditDetailsRequest request) {
        Provider p = providerRepository.findByIdAndIsDeletedIsFalse(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Provider not found"));
        if(p.getState().equals(Provider.ProviderState.rejected)){
            p.setState(Provider.ProviderState.pending);
        }
        if (request.oldPassword() != null && request.newPassword() != null) {
            if (passwordEncoder.matches(request.oldPassword(), p.getPassword())) {
                p.setPassword(passwordEncoder.encode(request.newPassword()));
            } else throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Old password is not correct");
        }
        if (request.name() != null) {
            p.setName(request.name());
        }
        if (request.phone() != null) {
            if (providerRepository.existsByPhone(request.phone()))
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phone number already exists");
            p.setPhone(request.phone());
        }
        if (request.birthDate() != null) {
            System.out.println("BIRTHDATE NOT NULL: " + request.birthDate());
            p.setBirthDate(request.birthDate());
        }

        if (request.photo() != null){
            String imageName = p.getId() + "-profile-photo";
            storageService.updateBucket(imageName, request.photo().getBytes());
            p.setPhotoURL(imageName);
        }

        providerRepository.save(p);
    }
    public void deleteProvider(Long id){
        Provider p = providerRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Provider not found"));
        if (p.getDeleted()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Provider doesn't exist");
        p.delete();
        storageService.deleteFile(p.getPhotoURL());
        providerRepository.save(p);
        availabilityIntervalRepository.deleteAll(p.getCalendarAvailability());
        serviceAreaRepository.deleteAll(p.getServiceAreas());
        providerServiceRepository.deleteAll(p.getServices());

    }

    public void deleteProviderServiceArea(Long id, String district, String municipality) {
        Provider p = findProviderById(id);
        p.getServiceAreas().stream().filter(sa -> (sa.getDistrict().getName().equals(district))
                && ( municipality == null || sa.getMunicipality().getName().equals(municipality)) ).forEach(serviceAreaRepository::delete);
    }

    public void deleteProviderAvailability(Long id, DayOfWeek day, LocalTime startTime, LocalTime endTime) {
        Provider p = findProviderById(id);
        p.getCalendarAvailability().stream().filter(ca -> ca.getDay().equals(day) && ca.getStartTime().equals(startTime) && ca.getEndTime().equals(endTime))
                .forEach(availabilityIntervalRepository::delete);
    }

    public void deleteProviderService(Long id, Long typeId) {
        ProviderService ps = providerServiceRepository.findById(new ProviderServiceId(id, typeId)).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Provider does not provide service with given type id"));
        providerServiceRepository.delete(ps);
    }

    public List<AvailabilityIntervalDTO> getProviderAvailability(Long id) {
        return providerRepository.getAvailabilityById(id).stream().map(AvailabilityIntervalDTO::getDTO).toList();
    }

    public void disapproveProvider(Long id) {
        Provider p = findProviderById(id);
        p.setState(Provider.ProviderState.rejected);
        notificationService.addNotification(p, Notification.NotificationType.ORDER_REJECTED,"Your provider account was rejected, please edit your profile","");
        providerRepository.save(p);
    }
}
