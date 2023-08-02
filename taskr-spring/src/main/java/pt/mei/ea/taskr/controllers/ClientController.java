package pt.mei.ea.taskr.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import pt.mei.ea.taskr.dto.ClientDTO;
import pt.mei.ea.taskr.dto.OrderDTO;
import pt.mei.ea.taskr.dto.ReviewDTO;
import pt.mei.ea.taskr.models.Client;
import pt.mei.ea.taskr.services.ClientService;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/users/clients")
public class ClientController {
    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }


    public record NewClientRequest(
            String name,
            String email,
            String password,
            String phone,
            Date birthDate
    ){}


    public record NewClientResponse(
            Long id,
            String type,
            String token
    ){}

    @PostMapping()
    public NewClientResponse addClient(@RequestBody NewClientRequest request) throws ResponseStatusException {
        return clientService.addClient(request);

    }

    /**
     * @return All clients
     * */
    @GetMapping()
    public List<ClientDTO> getClients() {
        return clientService.getAllClients().stream().map(ClientDTO::getDTO).toList();
    }


    @GetMapping("{id}")
    public ClientDTO getClient(@PathVariable("id") Long id) {
        Client c = clientService.getClient(id);
        return ClientDTO.getDTO(c);
    }

    @GetMapping("{id}/orders")
    public List<OrderDTO> getClientOrders(@PathVariable("id") Long id, @RequestParam(required = false) String orderState){
        return clientService.getClientOrders(id, orderState);
    }

    @GetMapping("{id}/reviews")
    public List<ReviewDTO> getClientReviews(@PathVariable("id") Long id, @RequestParam(required = false) Long typeId){
        return clientService.getClientReviews(id, typeId);
    }

    public record NewEditDetailsRequest(
            String name,
            String newPassword,
            String oldPassword,
            String phone,
            Date birthDate
    ){}

    @PostMapping("{id}/edit")
    public void editDetails(@PathVariable("id") Long id,@RequestBody NewEditDetailsRequest request){
        clientService.editDetails(id,request);
    }

    @DeleteMapping("{id}")
    public void deleteClient(@PathVariable("id") Long id) {
        clientService.deleteClient(id);
    }


}
