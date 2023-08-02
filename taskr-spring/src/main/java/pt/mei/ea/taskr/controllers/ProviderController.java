package pt.mei.ea.taskr.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import pt.mei.ea.taskr.dto.*;
import pt.mei.ea.taskr.services.ProvidersService;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/users/providers")
public class ProviderController {

    private final ProvidersService providersService;
    public ProviderController(ProvidersService providersService) {
        this.providersService = providersService;
    }

    /**
     * @return All providers
     * */
    @GetMapping()
    public List<ProviderWithReviewDTO> getProviders(@RequestParam(required = false) Integer rating,
                                          @RequestParam(required = false) Long typeId,
                                          @RequestParam(required = false) String district,
                                          @RequestParam(required = false) String municipality,
                                          @RequestParam(required = false) String state
                                          ){
        return providersService.getProvidersByParams(rating, typeId, district,municipality, state);
    }

    @GetMapping("{id}/reviews")
    public List<ReviewDTO> getProviderReviews(@PathVariable("id") Long providerId, @RequestParam(required = false) Long typeId){
        return providersService.getProviderReviews(providerId, typeId);
    }

    public record NewProviderRequest(
            String name,
            String email,
            String password,
            String phone,
            Date birthDate,
            String nif,
            String photo
    ){}

    public record addProviderResponse(
            Long id,
            String type,

            String token
    ){}
    @PostMapping()
    public addProviderResponse addProvider(@RequestBody NewProviderRequest request) throws ResponseStatusException {
        return providersService.addProvider(request);

    }

    @GetMapping("{id}")
    public ProviderDTO getProvider(@PathVariable("id") Long id) {
        return providersService.getProvider(id);
    }

    @PostMapping("{id}/approve")
    public void approveProvider(@PathVariable("id") Long id){
        providersService.approveProvider(id);
    }

    @PostMapping("{id}/disapprove")
    public void disapproveProvider(@PathVariable("id") Long id){
        providersService.disapproveProvider(id);
    }


    public record NewProviderServiceRequest(
            BigDecimal pricePerHour,
            Duration expectedDuration,
            String description,
            Long serviceTypeId
    ){}
    @PostMapping("{id}/service")
    public void addProviderService(@PathVariable("id") Long id, @RequestBody NewProviderServiceRequest request){
        providersService.addProviderService(id, request);
    }

    @DeleteMapping("{id}/service")
    public void deleteProviderService(@PathVariable("id") Long id,
                                   @RequestParam Long typeId){
        providersService.deleteProviderService(id, typeId);
    }

    public record NewProviderAreaRequest(
            String municipality,
            String district
    ){}
    @PostMapping("{id}/area")
    public void addProviderArea(@PathVariable("id") Long id, @RequestBody NewProviderAreaRequest request){
        providersService.addProviderServiceArea(id, request);
    }

    @DeleteMapping("{id}/area")
    public void deleteProviderArea(@PathVariable("id") Long id,
                                   @RequestParam String district,
                                   @RequestParam(required = false) String municipality ){
        providersService.deleteProviderServiceArea(id, district, municipality);
    }

    public record NewProviderAvailabilityRequest(
            List<AvailabilityIntervalDTO> availabilities
    ){}

    @PostMapping("{id}/availability")
    public void setProviderAvailability(@PathVariable("id") Long id, @RequestBody NewProviderAvailabilityRequest request){
        providersService.setProviderAvailability(id, request);
    }

    @GetMapping("{id}/availability")
    public List<AvailabilityIntervalDTO> getProviderAvailability(@PathVariable("id") Long id){
        return providersService.getProviderAvailability(id);
    }

    @DeleteMapping("{id}/availability")
    public void deleteProviderAvailability(@PathVariable("id") Long id,
                                           @RequestParam DayOfWeek day,
                                           @RequestParam LocalTime startTime,
                                           @RequestParam LocalTime endTime){
        providersService.deleteProviderAvailability(id, day, startTime, endTime);
    }

    @GetMapping("{id}/orders")
    public List<OrderDTO> getProviderOrders(@PathVariable("id") Long id, @RequestParam(required = false) String orderState){
        return providersService.getProviderOrders(id, orderState);
    }

    public record NewEditDetailsRequest(
            String name,
            String newPassword,
            String oldPassword,
            String phone,
            Date birthDate,
            String photo
    ){}

    @PostMapping("{id}/edit")
    public void editDetails(@PathVariable("id") Long id, @RequestBody ProviderController.NewEditDetailsRequest request){
        providersService.editDetails(id,request);
    }

    @DeleteMapping("{id}")
    public void deleteProvider(@PathVariable("id") Long id) {
        providersService.deleteProvider(id);
    }

}
