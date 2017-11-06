const Joi = require( 'joi' );

// Require and Configure dotenv, will load vars in .env
require( 'dotenv' ).config();

// Define validation for all the env vars
// 1st: Create a schema using the provided types & constraints
const envVarsSchema = Joi.object( {
	NODE_ENV: Joi.string()
		.allow( ['development', 'production', 'test', 'provision'] )
		.default( 'development' ),
	SERVER_PORT: Joi.number()
		.default( 3000 ),
	MONGOOSE_DEBUG: Joi.boolean()
		.when( 'NODE_ENV', {
			is: Joi.string().equal( 'development' ),
			then: Joi.boolean().default( true ),
			otherwise: Joi.boolean().default( false )
		} ),
	JWT_SECRET: Joi.string().required()
		.description( 'JWT Secret required to sign' ),
	MONGO_HOST: Joi.string().required()
		.description( 'Mongo DB host url' ),
	MONGO_PORT: Joi.number()
		.default( 27017 )
} ).unknown()
	.required();

// Overrides the handling of unknown keys for the scope of the
// current object

// 2nd: Value is validated against the schema
const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

// Create config
const config = {
	env: envVars.NODE_ENV,
	port: envVars.SERVER_PORT,
	mongooseDebug: envVars.MONGOOSE_DEBUG,
	jwtSecret: envVars.JWT_SECRET,
	mongo: {
		host: envVars.MONGO_HOST,
		port: envVars.MONGO_PORT
	}
};

module.exports = config;
