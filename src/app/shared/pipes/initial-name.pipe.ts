import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initialName',
  standalone: true
})
export class InitialNamePipe implements PipeTransform {

  transform(fullName: string): string {
    if (!fullName) return '';

    const names = fullName.trim().split(' ').filter(n => n.length > 0);

    if (names.length === 1) return names[0][0].toUpperCase();

    const firstInitial = names[0][0].toUpperCase();
    const lastInitial = names[names.length - 1][0].toUpperCase();

    return `${firstInitial}${lastInitial}`;
  }

}
