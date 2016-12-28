import React, { Component } from 'react';
import {
    Text,
    View,
    Platform
} from 'react-native';

import SQLite from 'react-native-sqlite-storage';

export default class SQLiteTexts extends Component {

    constructor(props) {
        super(props);

        this.state = {
            result: []
        };
    }

    componentWillMount() {
        // prepopulated the original database
        // The following are success in iOS and Android, but the code is different ...
        const db = SQLite.openDatabase(Platform.select({
            // Path: android/app/src/main/assets/database.db
            android: {
                name: 'test.db',
                createFromLocation: '~database.db',
                location: 'Library'
            },
            // Path: www/database.db
            // You need to create folder reference in XCode!
            // TODO: Find the way create folder reference without XCode.
            ios: {
                name: 'database.db',
                createFromLocation: 1
            }
        }),
        // Executed when opened
        () => console.log('Database Opened!'),
        // Executed when Error Occured!
        (err) => console.log(`Error: ${err}`));

        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM test', [], (tx2, results) => {
                console.log("Query completed");
                const len = results.rows.length;
                let result = [];
                  for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    console.log(`${row.key} = ${row.value}`);
                    result.push(row);
                  }
                  this.setState({ result: result });
            });
        });
    }

    render() {
        return (
            <View>
            {
                this.state.result.map((row) => (
                    <Text key={row.key}>Key={row.key}; Value={row.value}</Text>
                ))
            }
            </View>
        );
    }
}
