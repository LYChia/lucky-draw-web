module.exports = {
    apps: [
        {
            name: "lucky-draw-web",
            script: "./node_modules/react-scripts/scripts/start.js",
            env: {
                NODE_ENV: "development",
                PORT: 80
            },
            env_production: {
                NODE_ENV: "production",
                PORT: 80
            }
        }
    ]
}