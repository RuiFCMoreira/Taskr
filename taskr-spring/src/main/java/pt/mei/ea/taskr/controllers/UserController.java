package pt.mei.ea.taskr.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import pt.mei.ea.taskr.dto.NotificationDTO;
import pt.mei.ea.taskr.services.UserService;

import java.util.List;


@RestController
@RequestMapping("api/users")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    public record LoginResponse(
            Long id,
            String type,
            String token
    ){}

    @GetMapping("login")
    public LoginResponse login(@RequestParam String email, @RequestParam String password) throws ResponseStatusException{
        log.info(email,password);
        return userService.authenticate(email,password);
    }

    @GetMapping("{id}/notifications")
    public List<NotificationDTO> getNotifications(@PathVariable("id") Long id) {
        return userService.getNotifications(id);
    }

    public record NewNotificationRequest(
        String message,
        String referTo
    ){}

    @PostMapping("{id}/notification")
    public void addNotification(@PathVariable("id") Long id, @RequestBody NewNotificationRequest notification) {
        userService.addNotification(id, notification.message,notification.referTo);
    }

    @DeleteMapping("/notification/{id}")
    public void deleteNotification(@PathVariable("id") Long id) {
        userService.deleteNotification(id);
    }

}
