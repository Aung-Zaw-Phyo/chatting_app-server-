const jwt = require('jsonwebtoken')


module.exports = (req, res, next) => {
    try {

        const authHeader = req.get('Authorization')
        if (!authHeader) {
            const error = new Error('Unauthenticated!')
            error.statusCode = 401
            throw error
        }
        const token = authHeader.split(' ')[1]
        if(!token) {
            const error = new Error('Unauthenticated!')
            error.statusCode = 401
            throw error
        }

        jwt.verify(token, 'chatroom 123!@#',async (err, decodedtoken) => {
            // console.log('decodedtoken result: ', decodedtoken)
            if(!decodedtoken) {
                const error = new Error('Unauthenticated!')
                error.statusCode = 401
                next(error)
            }   
            if(err) {
                console.log(err.message)
            }else {
                req.userId = decodedtoken.id
                req.userEmail = decodedtoken.email
            }
        })
        next()
    } catch (error) {
        next(error)
    }
}

// module.exports = (req, res,next) => {
//     try {
//         const token = req.cookies.jwt;
//         if(!token) {
//             const error = new Error('Unauthenticated!')
//             error.statusCode = 401
//             throw error
//         }

//         jwt.verify(token, 'chatroom 123!@#',async (err, decodedtoken) => {
//             // console.log('decodedtoken result: ', decodedtoken)
//             if(!decodedtoken) {
//                 const error = new Error('Unauthenticated!')
//                 error.statusCode = 401
//                 next(error)
//             }   
//             if(err) {
//                 console.log(err.message)
//             }else {
//                 req.userId = decodedtoken.id
//                 req.userEmail = decodedtoken.email
//             }
//         })
//         next()
//     } catch (error) {
//         next(error)
//     }
// }