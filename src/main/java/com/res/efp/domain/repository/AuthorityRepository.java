package com.res.efp.domain.repository;

import com.res.efp.domain.model.Authority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by gatomulesei on 2/1/2018.
 */
@Repository
public interface AuthorityRepository extends JpaRepository<Authority, Long> {
    Authority findByName(String authorityName);
}
