package pt.mei.ea.taskr.dto;

import pt.mei.ea.taskr.models.Notification;

import java.time.LocalDateTime;

public record NotificationDTO (
    Long id,
    String notification,
    String type,

    String referTo

    ){

    public static NotificationDTO getDTO(Notification notification){
        return new NotificationDTO(notification.getId(), notification.getNotification(), notification.getType().toString(),notification.getReferTo());
    }
}
