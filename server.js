const app = require('./app');
const sequelize = require('./utils/database');

const PORT = process.env.PORT || 5000;



sequelize
    .sync()
    //the below line is use only in development environment only 
    // .sync({alter:true})
    .then(result => {
        if (result) {
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`); // eslint-disable-line
            });
        }
    })
    .catch(err => {
        throw err;
    })
