import { Topic } from "./Topic";

export class Content{
    id: number;
    title: string;
    description: string;
    url: string;
    thumbnail: any;
    format: string;
    topics: Topic[];
    platform: string;
    event_id: number;
    event_name: string;
    speaker_id: number;
    type_id: number;
}