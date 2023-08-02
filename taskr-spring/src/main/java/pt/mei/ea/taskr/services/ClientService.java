package pt.mei.ea.taskr.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;
import pt.mei.ea.taskr.config.JwtService;
import pt.mei.ea.taskr.controllers.ClientController;
import pt.mei.ea.taskr.dto.OrderDTO;
import pt.mei.ea.taskr.dto.ReviewDTO;
import pt.mei.ea.taskr.models.Client;
import pt.mei.ea.taskr.models.Order;
import pt.mei.ea.taskr.repositories.ClientRepository;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ClientService {

    private static final Logger log = LoggerFactory.getLogger(ClientService.class);

    private final UserService userService;
    private final ClientRepository clientRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;


    public ClientService(UserService userService, ClientRepository clientRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userService = userService;
        this.clientRepository = clientRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public ClientController.NewClientResponse addClient(@RequestBody ClientController.NewClientRequest request){
        log.info(request.toString());
        userService.checkUniqueUser(request.email(), request.phone());

        Client client = new Client();
        client.setName(request.name());
        client.setEmail(request.email());
        client.setPassword(passwordEncoder.encode(request.password()));
        client.setPhone(request.phone());
        client.setBirthDate(request.birthDate());
        Client newCli = clientRepository.save(client);

        String token = jwtService.generateToken(client);
        return new ClientController.NewClientResponse(newCli.getId(),"client", token);
    }

    public Client findClientById(Long id){
        return clientRepository.findByIdAndIsDeletedIsFalse(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client not found"));
    }

    public List<Client> getAllClients(){
        return clientRepository.findAllByIsDeletedIsFalse();
    }

    public Client getClient(Long id) {
        return findClientById(id);
    }

    public void editDetails(Long id,@RequestBody ClientController.NewEditDetailsRequest request){
        Client c = getClient(id);
        if(request.oldPassword() != null && request.newPassword() != null ){
            if(passwordEncoder.matches(request.oldPassword(), c.getPassword())) {
                c.setPassword(passwordEncoder.encode(request.newPassword()));
            } else throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Old password isn't correct");
        }
        if(request.name() != null){
            c.setName(request.name());
        }
        if(request.phone() != null){
            if(clientRepository.existsByPhone(request.phone()))
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Phone number already exists");
            c.setPhone(request.phone());
        }
        if(request.birthDate() != null){
            c.setBirthDate(request.birthDate());
        }
    clientRepository.save(c);
    }

    public void deleteClient(Long id){
        Client c =  clientRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Client not found"));
        if (c.getDeleted()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Client doesn't exist");
        c.delete();
        clientRepository.save(c);
    }

    public List<OrderDTO> getClientOrders(Long id, String orderState) {
        Client c = findClientById(id);
        return c.getOrders().stream().filter(order -> orderState == null || order.getState().toString().equals(orderState)
        ).map(OrderDTO::getDTO).collect(Collectors.toList());
    }

    public List<ReviewDTO> getClientReviews(Long id, Long typeId) {
        Client c = findClientById(id);
        Stream<Order> orderStream = c.getOrders().stream();
        if(typeId != null){
            orderStream = orderStream.filter(order -> order.getServiceType().getId().equals(typeId));
        }
        return orderStream.map(Order::getReview).filter(Objects::nonNull).map(ReviewDTO::getDTO).toList();
    }


}
