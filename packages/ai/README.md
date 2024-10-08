
## Running the Flask App with Poetry

To run the Flask app using Poetry:

1. Make sure you have Poetry installed. If not, install it following the instructions at https://python-poetry.org/docs/#installation

2. Navigate to the `packages/ai` directory:
   ```
   cd packages/ai
   ```

3. Install the project dependencies:
   ```
   poetry install
   ```

4. Activate the virtual environment:
   ```
   poetry shell
   ```

5. Run the Flask app:
   ```
   python main.py
   ```

6. The app will be available at `http://localhost:5000`

You can now access the following routes:
- `/`: Returns a "Hello, AI!" message
- `/health`: Returns a health check status
- `/version`: Returns the current version of the app

To exit the virtual environment, simply type `exit` or press `Ctrl+D`.

## Running the Flask App with npm/yarn

You can also use npm or yarn to manage the AI component:

1. Navigate to the `packages/ai` directory:
   ```
   cd packages/ai
   ```

2. Install dependencies:
   ```
   npm run build
   ```
   or
   ```
   yarn build
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

4. For production, use:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

The app will be available at `http://localhost:5000`