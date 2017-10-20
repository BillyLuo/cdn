import * as React from 'react';

export default class User  extends React.Component<{match:any},{}>{
    constructor(props:any) {
        super(props);
    }
    render () {
        return (
            <div>
                this is user
            </div>
        )
    }
}