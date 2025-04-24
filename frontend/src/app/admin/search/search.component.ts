import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  
  @Output() search = new EventEmitter<string>();

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.search.emit(term);
    });
  }

  onSearch() {
    // Emit immediately when Enter is pressed
    this.search.emit(this.searchTerm.trim());
  }

  onInputChange() {
    // Use debounce for input changes
    this.searchSubject.next(this.searchTerm.trim());
  }
}
