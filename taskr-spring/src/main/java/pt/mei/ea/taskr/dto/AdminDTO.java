package pt.mei.ea.taskr.dto;

import pt.mei.ea.taskr.models.Admin;

import java.util.Date;

public record AdminDTO(
    Long id,
    String name,
    String email,
    String phone,
    Date birthDate
){

    public static AdminDTO getDTO(Admin client){
        return new AdminDTO(client.getId(),client.getName(),client.getEmail(),client.getPhone(),client.getBirthDate());
    }
}
