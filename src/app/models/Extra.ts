export class Extra {
    
        id: string;
        key: string;
        value: string;
        state: string;
        revision_id: string;
        group_id: string;
    
        constructor(id: string, key: string, value: string, state: string, revision_id: string, group_id: string) {
            this.id = id;
            this.key = key;
            this.value = value;
            this.state = state;
            this.revision_id = revision_id;
            this.group_id = group_id;
        }
    }