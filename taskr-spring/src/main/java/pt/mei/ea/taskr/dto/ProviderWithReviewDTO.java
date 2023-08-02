package pt.mei.ea.taskr.dto;

import pt.mei.ea.taskr.models.Provider;

import java.util.Date;
import java.util.List;

public record ProviderWithReviewDTO(
            Long id,
            String name,
            String email,
            String phone,
            Date birthDate,
            String nif,
            String photo,
            float averageRating,
            Integer numberOfReviews,
            String state,
            ReviewDTO review,
            List<ProviderServiceDTO> providerServices,
            List<ServiceAreaDTO> providerServiceAreas,
            List<AvailabilityIntervalDTO> availability
    ){
    public static pt.mei.ea.taskr.dto.ProviderWithReviewDTO getDTO(Provider provider, String photo, ReviewDTO review) {
        return new pt.mei.ea.taskr.dto.ProviderWithReviewDTO(provider.getId(),
                provider.getName(),
                provider.getEmail(),
                provider.getPhone(),
                provider.getBirthDate(),
                provider.getNif(),
                photo,
                provider.getAverageRating(),
                provider.getNumberOfReviews(),
                provider.getState().toString(),
                review,
                provider.getServices().stream().map(ProviderServiceDTO::getDTO).toList(),
                provider.getServiceAreas().stream().map(ServiceAreaDTO::getDTO).toList(),
                provider.getCalendarAvailability().stream().map(AvailabilityIntervalDTO::getDTO).toList());
    }
}

