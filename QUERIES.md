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

## Profile Module

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

#### Update Profile

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

## Post Module

#### Get All Posts

    query {
      getAllPosts {
        id
        title
        content
        userId
      }
    }

#### Get Post By Id

    query getPostById($id: ID!) {
      getPostById(id: $id) {
        id
        title
        content
        userId
      }
    }

#### Create Post

    mutation createPost($input: PostInput!){
      createPost(input: $input) {
        id
        title
        content
        userId
      }
    }

#### Delete Post By Id

    mutation deletePost($id: ID!){
      deletePost(id: $id) {
        id
        title
        content
        userId
      }
    }

#### Update Post

    mutation updatePost($id: ID!, $input: PostInput!){
      updatePost(id: $id, input: $input) {
        id
        title
        content
        userId
      }
    }

## Member Type Module

#### Get All Member Types

    query {
      getAllMemberTypes {
        id
        discount
        monthPostsLimit
      }
    }

#### Get Member Type By Id

    query getMemberTypeById($id: ID!) {
      getPostById(id: $id) {
        id
        discount
        monthPostsLimit
      }
    }

#### Update Member Type

    mutation updateMemberType($id: ID!, $input: MemberTypeInput!){
      updateMemberType(id: $id, input: $input) {
        id
        discount
        monthPostsLimit
      }
    }