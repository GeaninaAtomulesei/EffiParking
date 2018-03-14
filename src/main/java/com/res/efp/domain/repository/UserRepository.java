package com.res.efp.domain.repository;

import com.res.efp.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by gatomulesei on 2/1/2018.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);

    @Query(value = "select distinct u from User as u where " +
                   "u.firstName like %:term% or " +
                   "u.lastName like %:term% or " +
                   "u.username like %:term% or " +
                   "concat(u.firstName, ' ', u.lastName) like %:term%")
    List<User> findByTerm(@Param("term") String term);
}
