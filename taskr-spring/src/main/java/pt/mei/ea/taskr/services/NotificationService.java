package pt.mei.ea.taskr.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pt.mei.ea.taskr.models.Notification;
import pt.mei.ea.taskr.models.User;
import pt.mei.ea.taskr.repositories.NotificationRepository;

@Service
public class NotificationService {
    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);


    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }


    public void deleteNotification(Long notificationId){
        if(!notificationRepository.existsById(notificationId)) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Notification not found");
        notificationRepository.deleteById(notificationId);
    }

    public void deleteNotificationByReferTo(String orderID){
        if(!notificationRepository.existsByReferTo(orderID)) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Notification not found");
        notificationRepository.deleteByReferTo(orderID);

    }

    public void addNotification(User user, Notification.NotificationType type, String message, String referTo){
        Notification n = new Notification();
        n.setType(type);
        n.setNotification(message);
        n.setUser(user);
        n.setReferTo(referTo);
        notificationRepository.save(n);
    }
}
