import React from 'react';
import './App.css';
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';  
import {flowRight as compose} from 'lodash';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteIcon from '@material-ui/icons/Delete';
import Form from './Form.js';

const todosQuery = gql`{
  todos{
    id
    text
    complete
  }
}`;

const updateMutation = gql`
  mutation($id: ID!, $complete: Boolean!){
    updateTodo(id:$id, complete: $complete)
  }
`;

const removeMutation = gql`
  mutation($id:ID!){
    removeTodo(id: $id)
  }
`;

const createMutation = gql`
  mutation($text: String!){
    createTodo(text:$text){
      id
      text
      complete
    }
  }
`;

function App(props) {
  const { data: { todos, loading } } = props;

  const updateTodo = async todo => {
    await props.updateTodo({
      variables: {
        id: todo.id,
        complete: !todo.complete
      },
      update: store => {
        let data = store.readQuery({ query: todosQuery });

        // we will use copy of data because we cannot modify data here
        let updatedData = {...data};
        
        updatedData.todos = data.todos.map(x => x.id === todo.id ? ({
          ...todo,
          complete : !todo.complete
        }) : x);


        store.writeQuery({query: todosQuery, data: updatedData});

      }
    })
  };

  const removeTodo = async todo => {
    await props.removeTodo({
      variables: {
        id: todo.id
      },
      update: store => {
        let data = store.readQuery({ query: todosQuery });

        // we will use copy of data because we cannot modify data here
        let updatedData = {...data};
        
        updatedData.todos = data.todos.filter(x => x.id !== todo.id);

        store.writeQuery({query: todosQuery, data: updatedData});

      }
    })
  }

  const createTodo = async text => {
    await props.createTodo({
      variables: {
        text
      },
      update: (store, { data: { createTodo } }) => {
        let data = store.readQuery({query: todosQuery});

        let updatedTodos = [...data.todos];
        updatedTodos.unshift(createTodo);
        let updatedData = {...data};
        updatedData.todos = updatedTodos;

        store.writeQuery({query: todosQuery, data: updatedData});
      }
    })
  }

  if (loading) {
    return null;
  }
  else {
    return (
      <div className="App">
        <div className="paper">
          <Paper elevation={1}>
            <Form submit={createTodo}/>
            <List>
              {todos.map((todo) => {
                const labelId = `${todo.id}-todo-item`;

                return (
                  <ListItem
                    key={todo.id} 
                    role={undefined} 
                    dense 
                    button 
                    onClick={() => updateTodo(todo)}
                  >
                    <ListItemIcon>
                      
                      <Checkbox
                        edge="start"
                        checked={todo.complete}
                        tabIndex={-1}
                      />
                    
                    </ListItemIcon>

                    <ListItemText id={labelId} primary={todo.text} />

                    <button className="btn" onClick={() => removeTodo(todo)}><DeleteIcon /></button>

                  </ListItem>
                );
              })}
            </List>

          </Paper>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(updateMutation, {name: "updateTodo"}),
  graphql(createMutation, {name: "createTodo"}),
  graphql(removeMutation, {name: "removeTodo"}),
  graphql(todosQuery)
)(App);

