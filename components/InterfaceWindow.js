import React from 'react'
import Tile from './Tile'

export default class InterfaceWindow extends React.Component {


    render() {

        const {selectedSquare} = this.props;

        return (<>
            <p>interface window</p>
            { selectedSquare ? (<>
                <Tile mapSquare={selectedSquare}/>
                <p>{selectedSquare.description}</p>
            </>) : ( null)
            }
        </>)
    }
}