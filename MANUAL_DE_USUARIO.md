# MANUAL DE USUARIO

Descargue la carpeta del codigo y abrala en Visual Studio Code...    
una vez ahi abre una nueva terminal, por favor asegurate que la terminal este ejecutandose en el directorio adecuado.  
ejecuta "npm start", lo modulos necesarios procederan a instalarse y podras ejecutar la aplicacion. 
    
Si es necesario, en el archivo index.js selecciona un puerto local disponible... 
  
por defecto (3003)    
http://localhost:3003/home

POR FAVOR ASEGEGURESE QUE SUS SOLICITUDES SEAN EN FORMATO JSON


# ENDPOINT "REGISTER"     
/accounts/register
{  
    "email": "mariana@gmail.com",   
    "name": "Maria Andrea",  
    "nickname": "Mariandre17",   
    "birthdate": "2000-10-10",  
    "password": "*********",  
    "list": "MEJORES PELICULAS ACCION"  
}  

# ENDPOINT "LOGIN"  
/accounts/login
{  
    "user": "Mariandre17",  
    "password": "*********"  
}   
# ENDPOINT LISTAS
/movies/lists/"

# ENDPOINT "addMovies"  
movies/list/addMovie
{      
    "title": "El origen",   
    "date": "2010-08"  
} 

# ENDPOINT "RATE MOVIES"
/movies/lists/rate/(:id_lista)"
{
    "rating": "4.5"
}

# ENDPOINT "deleteMovies"

TE DIRIGIRAS A TU LISTA METODO DELETE


