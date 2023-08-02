package pt.mei.ea.taskr.dto;

import pt.mei.ea.taskr.models.Provider;

import java.util.Date;
import java.util.List;

    public record ProviderDTO(
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
            List<ProviderServiceDTO> providerServices,
            List<ServiceAreaDTO> providerServiceAreas,
            List<AvailabilityIntervalDTO> availability
    ){
        public static ProviderDTO getDTO(Provider provider, String photo) {
            return new ProviderDTO(provider.getId(),
                    provider.getName(),
                    provider.getEmail(),
                    provider.getPhone(),
                    provider.getBirthDate(),
                    provider.getNif(),
                    photo,
                    provider.getAverageRating(),
                    provider.getNumberOfReviews(),
                    provider.getState().toString(),
                    provider.getServices().stream().map(ProviderServiceDTO::getDTO).toList(),
                    provider.getServiceAreas().stream().map(ServiceAreaDTO::getDTO).toList(),
                    provider.getCalendarAvailability().stream().map(AvailabilityIntervalDTO::getDTO).toList());
        }
}
