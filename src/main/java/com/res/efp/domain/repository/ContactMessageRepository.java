package com.res.efp.domain.repository;

import com.res.efp.domain.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by gatomulesei on 3/22/2018.
 */
@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
}
