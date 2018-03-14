package com.res.efp.domain.repository;

import com.res.efp.domain.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by gatomulesei on 2/5/2018.
 */
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByParkingId(Long id);
    List<Reservation> findByUserId(Long userId);

    @Query(value = "select r from Reservation as r\n" +
            "left join r.user as u " +
            "left join r.parking as p " +
            "where u.firstName like %:name% " +
            "or u.lastName like %:name% " +
            "or concat(u.firstName, ' ', u.lastName) like %:name%")
    List<Reservation> findByUser(@Param("name") String name);

}