
# CTeeth frontend

This is the user interface for CTeeth.

## Setup for development

1. Install git. If you are running in Windows, git bash is also recommended
2. Install Visual Studio Code
3. Install Chrome
4. If you don't already have one, [Create a SSH key for GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
5. Check out the project and open it in VSCode:

       $ git clone git@github.com:cteeth-uw/frontend
       $ cd frontend
       $ code .

6. [Install scoop](https://scoop.sh/)
7. Use scoop to install Node.js (I had to install/update 7zip first for this to work):

       $ scoop install 7zip
       $ scoop install nodejs

8. Vite is a wrapper for various frontend frameworks and includes a nice development server. If you need to run vite at the command line, install it globally:

       $ npm install -g vite

9. Run the vite dev server:

       $ npm run dev

   Then you can visit http://localhost:5173
