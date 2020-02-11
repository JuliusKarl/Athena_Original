import {Component, OnInit} from '@angular/core';
import {KafkaService} from '../../services/kafka.service';

@Component({
  selector: 'app-kafka-topics-list',
  templateUrl: './kafka-topics-list.html',
  styleUrls: ['./kafka-topics-list.component.css']
})
export class KafkaTopicsListComponent implements OnInit {

  allTopics: string[];
  topics: string[];

  loading = true;
  errorWhileLoading = false;
  showSystemTopics = false;

  searchText = '';

  constructor(private kafkaService: KafkaService) {
  }

  ngOnInit() {
    this.listTopics();
  }

  listTopics(): void {
    this.loading = true;
    this.kafkaService.getTopics().subscribe( data => {
      this.allTopics = data;
      this.topics = this.filterSystemTopics(this.allTopics);
      this.loading = false;
    }, error => {
      console.log('kafka-topics-list-component: Unable to get kafka topics');
      this.errorWhileLoading = true;
      this.loading = false;
    });
  }

  filterSystemTopics(topics: string[]): string[] {
    if (this.showSystemTopics) {
      return topics;
    }
    else {
      return topics.filter( topic => !topic.startsWith('_'));
    }
  }

  toggleSystemTopics(): void {
    this.showSystemTopics = !this.showSystemTopics;
    this.topics = this.filterSystemTopics(this.allTopics);
  }
}

