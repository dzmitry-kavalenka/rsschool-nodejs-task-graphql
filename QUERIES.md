## User Module

#### Create User

    mutation createUser($input: UserInput!){
      createUser(input: $input) {
        id
        firstName
        lastName
        email
        subscribedToUserIds
      }
    }

#### Get All Users

    query {
      getAllUsers {
        id
        email
        firstName
        lastName
        subscribedToUserIds
      }
    }

#### Get User By Id

    query getUserById($id: ID!) {
      getUserById(id: $id) {
        id
        email
        firstName
        lastName
        subscribedToUserIds
      }
    }

#### Delete User By Id

    mutation deleteUser($id: ID!){
      deleteUser(id: $id) {
        id
        firstName
        lastName
        email
        subscribedToUserIds
      }
    }

#### Subscribe To

    mutation subscribeTo($userId: ID!, $userIdToSub: ID!) {
      subscribeTo(userId: $userId, userIdToSub: $userIdToSub) {
        id
        firstName
        lastName
        email
        subscribedToUserIds
      }
    }

#### Unsubscribe From

    mutation unsubscribeFrom($userId: ID!, $userIdToUnSub: ID!) {
      subscribeTo(userId: $userId, userIdToSub: $userIdToUnSub) {
        id
        firstName
        lastName
        email
        subscribedToUserIds
      }
    }

#### Update User

    mutation updateUser($id:ID!, $input: UserInput!){
      updateUser(id:$id, input: $input) {
        id
        firstName
        lastName
        email
        subscribedToUserIds
      }
    }

## Profiles Module

#### Get All Profiles

    query {
      getAllProfiles {
        id
        avatar
        sex
        birthday
        country
        street
        city
        memberTypeId
        userId
      }
    }

#### Get Profile By Id

    query getProfileById($id: ID!) {
      getProfileById(id: $id) {
        id
        avatar
        sex
        birthday
        country
        street
        city
        memberTypeId
        userId
      }
    }

#### Create Profile

    mutation createProfile($input: ProfileInput!){
      createProfile(input: $input) {
        id
        avatar
        sex
        birthday
        country
        street
        city
        memberTypeId
        userId
      }
    }

#### Delete Profile By Id

    mutation deleteProfile($id: ID!){
      deleteProfile(id: $id) {
        id
        avatar
        sex
        birthday
        country
        street
        city
        memberTypeId
        userId
      }
    }

#### Update User

    mutation updateProfile($id:ID!, $input: ProfileInput!){
      updateProfile(id:$id, input: $input) {
        id
        avatar
        sex
        birthday
        country
        street
        city
        memberTypeId
        userId
      }
    }