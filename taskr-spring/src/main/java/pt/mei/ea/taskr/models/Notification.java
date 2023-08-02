package pt.mei.ea.taskr.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Notifications")
public class Notification {

    public enum NotificationType {
        NEW_ORDER,
        ORDER_ACCEPTED,
        ORDER_REJECTED,
        ORDER_PAID,
        ORDER_REVIEWED,
        PAY,
        OTHER
    }

    @Id
    @GeneratedValue
    public Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    public User user;
    public NotificationType type;
    public String notification;
    public String referTo;

    public Notification(Long id, User user, NotificationType type, String notification, String referTo) {
        this.id = id;
        this.user = user;
        this.type = type;
        this.notification = notification;
        this.referTo = referTo;
    }

    public Notification() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public String getNotification() {
        return notification;
    }

    public void setNotification(String notification) {
        this.notification = notification;
    }

    public void setUser(User user) {
        this.user = user;
    }


    public String getReferTo() {
        return referTo;
    }

    public void setReferTo(String referTo) {
        this.referTo = referTo;
    }
}