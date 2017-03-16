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
        message: "No authentication token"
    },
    wrongToken: {
        code: 1,
        message: "Wrong authentication token"
    },

    adminNotFound: {
        code: 2,
        message: "Could not find admin data"
    },
    studentCreateError: {
        code: 3,
        message: "Could not create user"
    },
    cantCreateEvent: {
        code: 4,
        message: "Could not create Event"
    },
    cantfetchEvent: {
        code: 5,
        message: "Could not fetch events"
    },
    cantEditEvent: {
        code: 6,
        message: "Could not edit events"
    },
    cannotEditAdmin: {
        code: 7,
        message: "Could not edit Admin"
    },
    cantDeleteEvent: {
        code: 5,
        message: "Could not delete events"
    },
    needsSuperAdmin: {
        code: 9,
        message: "Needs super admin privilages"
    },
    studentNotFound: {
        code: 11,
        message: "Student could not be found"
    },
    cantFetchCollege: {
        code: 12,
        message: "Could not fetch college list"
    },
    registerFailed: {
        code: 13,
        message: "Could not register student"
    },
    noEventError: {
        code: 14,
        message: "Could not find event to register"
    },
    noStudentFound: {
        code: 15,
        message: "Could not find student"
    },
    exceptionThrown: {
        code: 16,
        message: "Exception thrown"
    },
    studentSuspended: {
        code: 17,
        message: "Account has been suspended"
    },
    cantfetchHighlights: {
        code: 18,
        message: "Could not fetch highlights"
    },
    cantcreateHighlights: {
        code: 19,
        message: "Could not create highlights"
    },

    cantEditHighlight: {
        code: 20,
        message: "Could not edit highlights"
    },
    fcmError: {
        code: 21,
        message: "Could not send notification"
    },
    cantPutCollege: {
        code: 22,
        message: "Could not put college"
    },
    cantUnregister: {
        code: 23,
        message: "Could not Unregister, Event registration entry not found"
    },
    notEnoughPrivilege: {
        code: 24,
        message: "You don't have permission to access this feature"
    }
}