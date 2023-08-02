package pt.mei.ea.taskr.controllers;

import org.springframework.web.bind.annotation.*;
import pt.mei.ea.taskr.dto.OrderDTO;
import pt.mei.ea.taskr.dto.ReviewDTO;
import pt.mei.ea.taskr.services.OrderService;

import java.time.Duration;
import java.time.LocalDateTime;

@RestController
@RequestMapping("api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    public record NewOrderRequest(
        Long providerId,
        String description,
        LocalDateTime dateHour,
        Long serviceTypeId,
        String street,
        String parish,
        String municipality,
        String district,
        Long clientId
    ) {}
    @PostMapping()
    public void addOrder(@RequestBody NewOrderRequest request){
        orderService.addOrder(request);
    }

    @GetMapping("{id}")
    public OrderDTO getOrder(@PathVariable("id") Long id){
        return OrderDTO.getDTO(orderService.getOrder(id));
    }

    public record ReviewRequest(
            String description,
            Integer rating
    ) {}

    @PostMapping("{id}/review")
    public void makeReview(@PathVariable("id") Long id, @RequestBody ReviewRequest request){
        orderService.makeReview(id, request);
    }

    public record NewCompleteRequest(
            Duration duration
    ) {}
    @PostMapping("{id}/completed")
    public void setComplete(@PathVariable("id") Long id, @RequestBody NewCompleteRequest request){
        orderService.setComplete(id,request.duration);
    }

    @PostMapping("{id}/accept")
    public void accept(@PathVariable("id") Long id){
        orderService.accept(id);
    }

    @PostMapping("{id}/reject")
    public void reject(@PathVariable("id") Long id){
        orderService.reject(id);
    }

    @PostMapping("{id}/cancel")
    public void cancel(@PathVariable("id") Long id){ orderService.cancel(id);}

    @GetMapping("{id}/review")
    public ReviewDTO getReview(@PathVariable("id") Long id){ return orderService.getReview(id);}

    @PostMapping("{id}/pay")
    public void pay(@PathVariable("id") Long id){ orderService.pay(id);}
}
