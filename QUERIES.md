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
      getAll {
        id
        email
        firstName
        lastName
        subscribedToUserIds
      }
    }

#### Get User By Id

    query getById($id: ID!) {
      getById(id: $id) {
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

#### UpdateUser
    mutation updateUser($id:ID!, $input: UserInput!){
      updateUser(id:$id, input: $input) {
        id
        firstName
        lastName
        email
        subscribedToUserIds
      }
    }