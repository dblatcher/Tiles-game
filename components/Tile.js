import React from 'react'
import styles from './tile.module.css'

export default class Tile extends React.Component {

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }
    
    plot() {
        const{tileData, containingSet} = this.props
        tileData.plot(this.canvasRef.current, containingSet)
    }

    componentDidMount() {
        this.plot()
    }

    componentDidUpdate() {
        this.plot()
    }


    render () {
        return (
            <canvas 
            onClick={this.props.clickHandler}
            ref={this.canvasRef}
            width={this.props.tileData.canvasWidth} 
            height={this.props.tileData.canvasHeight} 
            className={styles.tile} />
        )
    }
}