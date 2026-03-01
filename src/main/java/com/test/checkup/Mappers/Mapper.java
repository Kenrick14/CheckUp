package com.test.checkup.Mappers;

public interface Mapper<A,B> {
    B mapTo(A a);
    A mapFrom(B b);
}
