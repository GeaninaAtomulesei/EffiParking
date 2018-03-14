package com.res.efp.service;
import com.res.efp.domain.model.Notification;
import java.util.List;

/**
 * Created by gatomulesei on 3/9/2018.
 */
public interface NotificationService {
    Notification saveNotification(Notification notification);
    void pushNotification(Notification notification, Long userId);
    List<Notification> getByUserId(Long userId);
    boolean deleteNotification(Notification notification);
    Notification getById(Long notificationId);
}
