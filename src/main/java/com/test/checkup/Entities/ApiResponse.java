package com.test.checkup.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.springframework.data.jpa.repository.Meta;

import java.util.List;

public class ApiResponse<T> {
    private List<T> data;
    private Meta meta;

    public List<T> getData() { return data; }
    public void setData(List<T> data) { this.data = data; }

    public Meta getMeta() {
        return meta;
    }

    public void setMeta(Meta meta) {
        this.meta = meta;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Meta{
        private Long next_cursor;
        private int per_page;
    }
}
