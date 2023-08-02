package pt.mei.ea.taskr.services;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pt.mei.ea.taskr.config.JwtService;
import pt.mei.ea.taskr.controllers.UserController;
import pt.mei.ea.taskr.dto.NotificationDTO;
import pt.mei.ea.taskr.models.*;
import pt.mei.ea.taskr.repositories.*;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final NotificationService notificationService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;


    public UserService(UserRepository userRepository, NotificationService notificationService, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }


    public boolean emailExists(String email){
        return userRepository.findIdByEmail(email) != null;
    }

                public boolean phoneExists(String phone){
        return userRepository.findIdByPhone(phone) != null;
    }

    public void checkUniqueUser(String email, String phone) throws ResponseStatusException{
        if(emailExists(email)){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "There is an account with that email address");
        } else if(phoneExists(phone)){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "There is an account with that phone number");
        }
    }

    public UserController.LoginResponse authenticate(String email, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        User user = userRepository.findByEmail(email).orElseThrow();
        var jwtToken = jwtService.generateToken(user);

        String type;
        if(user instanceof Client){
            type = "client";
        } else if(user instanceof Admin){
            type = "admin";
        } else if(user instanceof Provider){
            type = "provider";
        } else {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Invalid user type");
        }

        return new UserController.LoginResponse(user.getId(), type, jwtToken);
    }

    public List<NotificationDTO> getNotifications(Long id) {
        User u = userRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"User not found"));
        return u.getNotifications().stream().map(NotificationDTO::getDTO).toList();
    }

    public void addNotification(Long id,String notification,String referTo) {
        User u = userRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"User not found"));
        notificationService.addNotification(u, Notification.NotificationType.OTHER, notification,referTo);
    }

    public void deleteNotification(Long notificationId) {
        notificationService.deleteNotification(notificationId);
    }

}
