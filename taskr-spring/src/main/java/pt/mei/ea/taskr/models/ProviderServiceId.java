package pt.mei.ea.taskr.models;

import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class ProviderServiceId implements Serializable {
    private Long providerId;
    private Long typeId;

    public ProviderServiceId(Long providerId, Long typeId) {
        this.providerId = providerId;
        this.typeId = typeId;
    }

    public ProviderServiceId() {

    }
}
