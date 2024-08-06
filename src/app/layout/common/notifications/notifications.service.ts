
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from 'app/layout/common/notifications/notifications.types';
import { map, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private _notifications: ReplaySubject<Notification[]> = new ReplaySubject<Notification[]>(1);
  private apiUrl = 'http://localhost:3000/notifications';

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {}

  /**
   * Getters for notifications
   **/
  getUserEmail(): string {
    return localStorage.getItem('email');
  }

  /**
   * Getter for notifications
   */
  get notifications$(): Observable<Notification[]> {
    return this._notifications.asObservable();
  }

  /**
   * Get all notifications for a user
   */
  getAll(email?: string): Observable<Notification[]> {
    const userEmail = email || this.getUserEmail();
    return this._httpClient.get<Notification[]>(`${this.apiUrl}/${userEmail}`).pipe(
      tap((notifications) => {
        this._notifications.next(notifications);
        console.log(userEmail);
      })
    );
  }

  /**
   * Create a notification
   *
   * @param notification
   */
  create(notification: Notification): Observable<Notification> {
    return this.notifications$.pipe(
      take(1),
      switchMap((notifications) =>
        this._httpClient.post<Notification>(this.apiUrl, { notification }).pipe(
          map((newNotification) => {
            // Update the notifications with the new notification
            this._notifications.next([...notifications, newNotification]);

            // Return the new notification from observable
            return newNotification;
          })
        )
      )
    );
  }

  /**
   * Update the notification
   *
   * @param id
   * @param notification
   */
  update(id: string, notification: Notification): Observable<Notification> {
    return this.notifications$.pipe(
      take(1),
      switchMap((notifications) =>
        this._httpClient.patch<Notification>(`${this.apiUrl}/${id}`, {
          notification,
        }).pipe(
          map((updatedNotification: Notification) => {
            // Find the index of the updated notification
            const index = notifications.findIndex((item) => item.id === id);

            // Update the notification
            notifications[index] = updatedNotification;

            // Update the notifications
            this._notifications.next(notifications);

            // Return the updated notification
            return updatedNotification;
          })
        )
      )
    );
  }

  /**
   * Delete the notification
   *
   * @param id
   */
  delete(id: string): Observable<boolean> {
    return this.notifications$.pipe(
      take(1),
      switchMap((notifications) =>
        this._httpClient.delete<boolean>(`${this.apiUrl}/${id}`).pipe(
          map((isDeleted: boolean) => {
            // Find the index of the deleted notification
            const index = notifications.findIndex((item) => item.id === id);

            // Delete the notification
            notifications.splice(index, 1);

            // Update the notifications
            this._notifications.next(notifications);

            // Return the deleted status
            return isDeleted;
          })
        )
      )
    );
  }

  /**
   * Mark a single notification as read/unread
   *
   * @param id
   */
  markAsRead(notificationId: string): Observable<Notification> {
    const email = this.getUserEmail();
    return this.notifications$.pipe(
      take(1),
      switchMap((notifications) =>
        this._httpClient.patch<Notification>(`${this.apiUrl}/mark-as-read`, { email, notificationId }).pipe(
          map((updatedNotification) => {
            // Update the notification in the list
            const index = notifications.findIndex((notification) => notification.id === notificationId);
            notifications[index] = updatedNotification;

            // Update the notifications
            this._notifications.next(notifications);

            // Return the updated notification
            return updatedNotification;
          })
        )
      )
    );
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<boolean> {
    const email = this.getUserEmail();
    return this.notifications$.pipe(
      take(1),
      switchMap((notifications) =>
        this._httpClient.patch<boolean>(`${this.apiUrl}/mark-all-as-read`, { email }).pipe(
          map((isUpdated) => {
            if (isUpdated) {
              // Update all notifications to be read
              notifications.forEach((notification) => (notification.read = true));
              this._notifications.next(notifications);
            }

            // Return the updated status
            return isUpdated;
          })
        )
      )
    );
  }
}
