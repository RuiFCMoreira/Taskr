package pt.mei.ea.taskr.dto;

import pt.mei.ea.taskr.models.Client;

import java.util.Date;

public record ClientDTO(
        Long id,
        String name,
        String email,
        String phone,
        Date birthDate
){
    public static ClientDTO getDTO(Client client){
        return new ClientDTO(client.getId(),client.getName(),client.getEmail(),client.getPhone(),client.getBirthDate());
    }
}