module.exports = {
    testProfile: {
        iss: 'https://securetoken.google.com/drishti-bd782',
        name: 'John Doe',
        picture: 'https://lh6.googleusercontent.com/-LdIUNFJBriQ/AAAAAAAAAAI/AAAAAAAAAvI/HUwlqct9yJY/photo.jpg',
        aud: 'drishti-bd782',
        auth_time: 1486452549,
        user_id: 'cJ2crx0lpVSbvPs1VbhU0BHgItE2',
        sub: 'cJ2crx0lpVSbvPs1VbhU0BHgItE2',
        iat: 1486452549,
        exp: 1486456149,
        email: 'johndoe@gmail.com',
        email_verified: true,
        uid: 'cJ2crx0lpVSbvPs1VbhU0BHgItE2'
    },
    noAuthToken: {
        code: 1,
        data: {
            msg: "No authentication token"
        },
        message: "Authentication Error"
    },
    wrongToken: {
        code: 1,
        data: {
            msg: "Wrong authentication token"
        },
        message: "Authentication Error"
    },
    adminNotFound: {
        code: 2,
        message: "Could not find admin data"
    },
    cannotEditAdmin: {
        code: 6,
        message: "Could not edit Admin"
    },
    needsSuperAdmin: {
        code: 9,
        message: "Needs super admin privilages"
    },
    studentNotFound: {
        code: 11,
        message: "Student could not be found"
    }
}
