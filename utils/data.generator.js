// utils/data.generator.js
import { faker } from '@faker-js/faker';

export const genUser = () => ({
  firstName : faker.person.firstName(),
  lastName  : faker.person.lastName(),
  email     : faker.internet.email(),
  password  : faker.internet.password({ length: 12, memorable: false }),
  phone     : faker.phone.number(),
});

export const genAddress = () => ({
  street  : faker.location.streetAddress(),
  city    : faker.location.city(),
  zip     : faker.location.zipCode(),
  country : faker.location.country(),
});

export const genEmployee = () => ({
  firstName  : faker.person.firstName(),
  lastName   : faker.person.lastName(),
  employeeId : faker.string.numeric(6),
  jobTitle   : faker.person.jobTitle(),
});
