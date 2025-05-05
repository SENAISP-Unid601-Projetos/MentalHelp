package com.example.Back.Repository;
<<<<<<< HEAD
=======

>>>>>>> ab9a84b43f224aa294b7d8ff72bc89d19baed1cb
import com.example.Back.entity.Telefone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

<<<<<<< HEAD
@Repository
public interface TelefoneRepository extends JpaRepository<Telefone, String> {

}
=======
import java.util.List;

@Repository
public interface TelefoneRepository extends JpaRepository<Telefone, String> {
    List<Telefone> findByIdPaciente(Long idPaciente);
}
>>>>>>> ab9a84b43f224aa294b7d8ff72bc89d19baed1cb
