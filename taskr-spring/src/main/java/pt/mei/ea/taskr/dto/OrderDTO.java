package pt.mei.ea.taskr.dto;

import pt.mei.ea.taskr.models.Order;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;

public record OrderDTO(
        Long id,
        Long providerId,
        String description,
        LocalDateTime datehour,
        ServiceTypeDTO serviceType,
        Duration duration,
        BigDecimal pricePerHour,
        String state,
        AddressDTO address,
        Long clientId,
        ReviewDTO review
){public static OrderDTO getDTO(Order order){
    if (order.getReview() == null){
        return new OrderDTO(order.getId(),
                order.getProvider().getId(),
                order.getDescription(),
                order.getDateHour(),
                ServiceTypeDTO.getDTO(order.getServiceType(), ""), //when getting order, service type does not need photo
                order.getDuration(),
                order.getPricePerHour(),
                order.getState().toString(),
                AddressDTO.getDTO(order.getAddress()),
                order.getClient().getId(),
                null
        );
    }else {
        return new OrderDTO(order.getId(),
                order.getProvider().getId(),
                order.getDescription(),
                order.getDateHour(),
                ServiceTypeDTO.getDTO(order.getServiceType(), ""), //when getting order, service type does not need photo
                order.getDuration(),
                order.getPricePerHour(),
                order.getState().toString(),
                AddressDTO.getDTO(order.getAddress()),
                order.getClient().getId(),
                ReviewDTO.getDTO(order.getReview())
        );
    }
}}

