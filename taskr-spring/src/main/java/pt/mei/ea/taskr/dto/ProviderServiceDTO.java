package pt.mei.ea.taskr.dto;

import pt.mei.ea.taskr.models.ProviderService;

import java.math.BigDecimal;
import java.time.Duration;

public record ProviderServiceDTO(
        BigDecimal pricePerHour,
        Duration expectedDuration,
        String description,
        float averageRating,
        Integer numberOfReviews,
        Integer numberOfCompletedTasks,
        ServiceTypeDTO serviceType
){
    public static ProviderServiceDTO getDTO(ProviderService providerService){
        return new ProviderServiceDTO(
                providerService.getPricePerHour(),
                providerService.getExpectedDuration(),
                providerService.getDescription(),
                providerService.getAverageRating(),
                providerService.getNumberOfReviews(),
                providerService.getNumberOfCompletedTasks(),
                ServiceTypeDTO.getDTO(providerService.getServiceType(), "")); //
    }
}
