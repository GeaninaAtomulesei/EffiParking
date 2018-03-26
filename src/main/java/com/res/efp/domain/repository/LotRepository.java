package com.res.efp.domain.repository;

import com.res.efp.domain.model.Lot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by gatomulesei on 2/5/2018.
 */
@Repository
public interface LotRepository extends JpaRepository<Lot, Long> {

    @Query(value = "select distinct l from Lot as l where parking.id = :parkingId and l.reserved = false")
    List<Lot> findNotReservedLotsPerParking(@Param("parkingId") Long parkingId);

    List<Lot> findByParkingId(Long parkingId);

    Lot findByNumber(int number);

    @Query(value = "select l from Lot as l where parking.id = :parkingId and l.number = :lotNumber")
    Lot findByNumberAndParking(@Param("parkingId") Long parkingId, @Param("lotNumber") int lotNumber);
}