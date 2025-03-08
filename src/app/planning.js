// firebase
// collections: users(+ wishlist,),
// pursheses,donations,exchnages,transports,freelance
// donate(goods),exchange(products),transport(offring),products(selling), gigs(freelance)

// product model

// id
// name
// price
// description
// image (url) 1+
// category
// owner { id, name, email ,imageUrl }
// createdAt
// updatedAt

// exchange model

// id
// itemOffered (description of item)
// itemWanted (optional)
// condition (new, used)
// location (optional)
// image (url) 1+
// owner { id, name, email ,imageUrl }
// createdAt (date)
// updatedAt (date)
// conversations (array of messages)
// status (open, closed)
// closedAt (date)
// closedBy { id, name, email ,imageUrl }
// requests (array of users)

// transport model

// id
// vehicleType (car, bike, truck, etc)
// capacity (number of passengers)
// route (from-to)
// price (per trip)
// image (url) 1+
// owner { id, name, email ,imageUrl }
// createdAt (date)
// updatedAt (date)
// conversations (array of messages)
// status (active, inactive)
// activeUntil (date)
// requests (array of users)

// freelance model

// id
// gigTitle
// description
// category
// packages [basic {title,description,price,revitions,deliveryTime}, {title,description,price,revitions,deliveryTime}, {title,description,price,revitions,deliveryTime}]
// technologies [html,css,js,react,angular,python,java,php,laravel,express,node,sql,nosql,mongodb,firebase,aws,azure,google cloud]
// image (url) 1+
// freelancer { id, name, email ,imageUrl }
// createdAt (date)
// updatedAt (date)
// conversations (array of messages)
// status (active, inactive)

// done model

// id
// doneTitle
// completionDate
// remarks
// proofImage (url) 1+
// doner { id, name, email ,imageUrl }
// createdAt (date)
// updatedAt (date)
// conversations (array of messages)
// status (inprogress, completed)
// completedAt (date)
// completedBy { id, name, email ,imageUrl }
