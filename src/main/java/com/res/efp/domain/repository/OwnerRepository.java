package com.res.efp.domain.repository;

import com.res.efp.domain.model.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by gatomulesei on 2/5/2018.
 */
@Repository
public interface OwnerRepository extends JpaRepository<Owner, Long> {

    Owner findByUsername(String username);
}