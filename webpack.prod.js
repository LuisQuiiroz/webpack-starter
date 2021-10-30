// configuración por defecto que webpack va a buscar cuando ejecutemos el 'nmp run biuld'

// Se necesita lo siguiente para plugin
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// Manera de Node.js para cargar archivos de otros paquetes

//Recomendacion, así está en la documentación
module.exports = {
    mode: 'production', // Modo: production | development
    output: {
        clean: true,// Limpia la carpeta dist antes de crear los archivos
        filename: 'main.[contenthash].js' // Nombre del archivo principal de js
    },
    module: { // Configuración de webpack
        // Podemos definir reglas 
        rules: [
            {
                // Instalar paquetes en la terminal: npm install --save--dev html-loader html-webpack-plugin
                //esta condición se va a aplicar si el archivo cumple la siguiente espresion regular
                test: /\.html$/, // Esto le dice a Webpack que busque un archivo con extensión  html
                loader: 'html-loader',
                // options: { minimize: true}
                options: {
                    sources: false
                }
            },
            {
                // Se necesita: npm install --save-dev css-loader style-loader
                test: /\.css$/, // que se aplique a esos documentos
                exclude: /styles.css$/, // Excluye este archivo, que si se ejecuta esta regla de css, ingora las demás, con esto hace que se ejecute la siguiente regla css
                use: ['style-loader', 'css-loader']
                // Los estilos se aplican en el main.js mediante un script, por lo que hasta el momento no hay un archivo propio dentro de la carpta dist
            },
            {
                // Se necesita: npm install --save-dev mini-css-extract-plugin
                test: /styles.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                // Se necesita: npm install file-loader --save-dev
                test: /\.(png|jpe?g|gif)$/, // Expresion regular que evalua cualquier imagen, sim importar en donde esté, y aplica las siguientes reglas 
                loader: 'file-loader',   
            },  
            {
                // Se necesita: npm install --save-dev babel-loader @babel/core
                //              npm install @babel/preset-env --save-dev
                // Babel se asegura que el codigo pueda ejecutarse en versiones anteriores del EMC6 y tenga mayores compatibilidades con otros novegadores                 
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
            },
        ],
    },
    // Se necesita: npm install terser-webpack-plugin css-minimizer-webpack-plugin --save-dev
    // Minimiza el css
    optimization: {
        minimize: true,
        minimizer:[
            new CssMinimizerPlugin(),
            new TerserPlugin(),
        ]
    },
    plugins:[ // Especificar los plugins que yo quiero
        new HtmlWebPackPlugin({
            title: 'Mi Webpack App',
            template:'./src/index.html', // Que archivo es el que quiero tomar
            // filename: './index.html' // y hacia donde quiero colocarlo
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[fullhash].css', // Nombre del nuevo archivo css 
            // filename: '[name].[fullhash].css', // Crea un nuevo archivo cada vez que se ejecuta para evitar que el cliente cargue el mismo archivo que tenia en caché, para asi garantizar que los cambios se apliquen correctamente
            ignoreOrder: false
        }),
        // Se necesita: npm install copy-webpack-plugin --save-dev
        new CopyPlugin({
            patterns: [
              { from: 'src/assets/', to: 'assets/' }
            ]
          }),
    ]
};