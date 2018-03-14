package com.res.efp.domain.repository;

import com.res.efp.domain.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by gatomulesei on 3/9/2018.
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

}
